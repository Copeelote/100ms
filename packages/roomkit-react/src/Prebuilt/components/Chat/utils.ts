export const formatTime = (date: Date) => {
  if (!(date instanceof Date)) {
    return '';
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // Use 24-hour format, no AM/PM suffix
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

export const CHAT_MESSAGE_LIMIT = 2000;
