import { onMounted, onUnmounted, type Ref } from 'vue';

// Lưu trữ danh sách các focus trap đang hoạt động (stack)
// Trap ở cuối cùng của mảng sẽ là trap đang active (ví dụ khi mở dialog chồng lên trang chính)
const trapStack: Ref<HTMLElement | null>[] = [];

export interface FocusTrapOptions {
  autoFocus?: boolean;
}

export function useFocusTrap(containerRef: Ref<HTMLElement | null>, options: FocusTrapOptions = { autoFocus: true }) {
  const focusableElementsString =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

  const handleKeyDown = (e: KeyboardEvent) => {
    // Chỉ xử lý nếu container hiện tại là trap nằm trên cùng của stack
    if (trapStack.length === 0 || trapStack[trapStack.length - 1] !== containerRef) return;
    
    if (e.key !== 'Tab' || !containerRef.value) return;

    const focusableElements = Array.from(
      containerRef.value.querySelectorAll<HTMLElement>(focusableElementsString)
    ).filter(el => {
       // Chỉ lấy các phần tử đang hiển thị
       return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
    });

    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement || !containerRef.value.contains(document.activeElement)) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement || !containerRef.value.contains(document.activeElement)) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  onMounted(() => {
    trapStack.push(containerRef);
    document.addEventListener('keydown', handleKeyDown);
    
    if (options.autoFocus) {
      setTimeout(() => {
        if (containerRef.value) {
          const focusableElements = containerRef.value.querySelectorAll<HTMLElement>(focusableElementsString);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }, 50);
    }
  });

  onUnmounted(() => {
    const index = trapStack.indexOf(containerRef);
    if (index > -1) {
      trapStack.splice(index, 1);
    }
    document.removeEventListener('keydown', handleKeyDown);
  });
}
