/**
 * Các hàm tiện ích xử lý số (Number)
 */
export class NumberUtils {
  
  /**
   * Định dạng tiền tệ VNĐ (ví dụ: 1000000 -> "1.000.000 ₫")
   * @param value Số tiền
   * @returns Chuỗi định dạng tiền tệ
   */
  static formatCurrencyVND(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  /**
   * Phân cách hàng nghìn (ví dụ: 1000000 -> "1,000,000")
   * @param value Số cần định dạng
   */
  static formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  }

  /**
   * Chuyển đổi công suất hệ thống điện mặt trời (từ W sang kW hoặc MW)
   * @param watt Công suất tính bằng Watt
   */
  static formatPowerCapacity(watt: number | null | undefined): string {
    if (watt === null || watt === undefined || isNaN(watt)) return '0 W';
    if (watt >= 1000000) {
      return (watt / 1000000).toFixed(2) + ' MW';
    } else if (watt >= 1000) {
      return (watt / 1000).toFixed(2) + ' kW';
    }
    return watt + ' W';
  }

  /**
   * Kiểm tra xem giá trị có phải là số hợp lệ không
   */
  static isValidNumber(value: any): boolean {
    return value !== null && value !== '' && !isNaN(Number(value));
  }
}
