export function formatPaginationResponse(arrData: any[]) {
  let response = { totalRecords: 0, data: [] };

  if (arrData.length > 0) {
    response = arrData[0];
  }

  return response;
}
