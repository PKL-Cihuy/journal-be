export function mongoDateToString(fieldName: string) {
  return {
    $dateToString: {
      format: '%Y-%m-%d %H:%M:%S',
      date: fieldName,
      timezone: 'Asia/Jakarta',
    },
  };
}
