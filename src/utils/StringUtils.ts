/**
 * Các hàm tiện ích xử lý chuỗi (String)
 */
export class StringUtils {
  
  /**
   * Kiểm tra chuỗi rỗng hoặc undefined/null
   * @param str Chuỗi cần kiểm tra
   * @returns true nếu rỗng, false nếu có nội dung
   */
  static isEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Cắt chuỗi nếu vượt quá độ dài tối đa và thêm dấu '...'
   * @param str Chuỗi cần cắt
   * @param maxLength Độ dài tối đa
   * @returns Chuỗi sau khi cắt
   */
  static truncate(str: string | null | undefined, maxLength: number): string {
    if (this.isEmpty(str)) return '';
    if (str!.length <= maxLength) return str!;
    return str!.substring(0, maxLength) + '...';
  }

  /**
   * Chuyển chuỗi thành dạng Kebab Case (ví dụ: "Hello World" -> "hello-world")
   * @param str Chuỗi cần chuyển đổi
   */
  static toKebabCase(str: string | null | undefined): string {
    if (this.isEmpty(str)) return '';
    return str!
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Xóa dấu Tiếng Việt
   * @param str Chuỗi Tiếng Việt có dấu
   */
  static removeVietnameseTones(str: string | null | undefined): string {
    if (this.isEmpty(str)) return '';
    let result = str!;
    result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    result = result.replace(/đ/g, 'd');
    result = result.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    result = result.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    result = result.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    result = result.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    result = result.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    result = result.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    result = result.replace(/Đ/g, 'D');
    return result;
  }
}
