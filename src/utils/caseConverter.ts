/**
 * Convert snake_case to camelCase
 * 스네이크 케이스를 카멜 케이스로 변환
 *
 * @param obj - Object with snake_case keys
 * @returns Object with camelCase keys
 *
 * @example
 * snakeToCamel({ user_status: "ACTIVE" }) // { userStatus: "ACTIVE" }
 * snakeToCamel({ user_memo_1: "test" }) // { userMemo1: "test" }
 */
export function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    // 스네이크 케이스를 카멜 케이스로 변환
    // user_status → userStatus
    // user_memo_1 → userMemo1
    const camelKey = key.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }

  return result;
}

/**
 * Convert camelCase to snake_case
 * 카멜 케이스를 스네이크 케이스로 변환
 *
 * @param obj - Object with camelCase keys
 * @returns Object with snake_case keys
 *
 * @example
 * camelToSnake({ userStatus: "ACTIVE" }) // { user_status: "ACTIVE" }
 * camelToSnake({ userMemo1: "test" }) // { user_memo_1: "test" }
 */
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    // 카멜 케이스를 스네이크 케이스로 변환
    // userStatus → user_status
    // userMemo1 → user_memo_1
    const snakeKey = key.replace(/([A-Z0-9])/g, (match) => `_${match.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }

  return result;
}

/**
 * Normalize parentID to parentId
 * parentID를 parentId로 정규화
 *
 * @param obj - Object that may contain parentID key
 * @returns Object with parentId instead of parentID
 *
 * @example
 * normalizeParentId({ parentID: 100 }) // { parentId: 100 }
 */
export function normalizeParentId(obj: Record<string, any>): Record<string, any> {
  const result = { ...obj };

  if ('parentID' in result) {
    result.parentId = result.parentID;
    delete result.parentID;
  }

  return result;
}

/**
 * Prepare data for REST API transmission (snake_case → camelCase + parentID normalization)
 * REST API 전송을 위한 데이터 준비 (스네이크 케이스 → 카멜 케이스 + parentID 정규화)
 *
 * @description
 * Converts frontend snake_case data to camelCase required by backend REST API.
 * 프론트엔드의 snake_case 데이터를 백엔드 REST API가 요구하는 camelCase로 변환합니다.
 *
 * Transformations:
 * - user_status → userStatus
 * - user_memo_1 → userMemo1
 * - parentID → parentId
 *
 * @param data - Data object to convert
 * @returns Object converted to camelCase with normalized parentId
 *
 * @example
 * const formData = { user_status: "ACTIVE", parentID: 100, user_memo_1: "test" };
 * const apiData = prepareRestApiData(formData);
 * // { userStatus: "ACTIVE", parentId: 100, userMemo1: "test" }
 */
export function prepareRestApiData(data: Record<string, any>): Record<string, any> {
  let result = snakeToCamel(data);
  result = normalizeParentId(result);
  return result;
}
