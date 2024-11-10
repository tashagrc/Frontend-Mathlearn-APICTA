export const timeAgo = (timestamp) => {
  const currentDate = new Date();
  const previousDate = new Date(timestamp);

  const timeDifference = currentDate.getTime() - previousDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} tahun lalu`;
  } else if (months > 0) {
    return `${months} bulan lalu`;
  } else if (days > 0) {
    return `${days} hari lalu`;
  } else if (hours > 0) {
    return `${hours} jam lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit lalu`;
  } else {
    return `${seconds} detik lalu`;
  }
};

export const convertToTime = (milliseconds) => {
  var seconds = milliseconds / 1000;
  var minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  var hours = Math.floor(minutes / 60);
  minutes = Math.floor(minutes % 60);

  // Membuat string untuk waktu
  var timeString = "";
  if (hours > 0) {
    timeString += hours + " jam, ";
  }
  if (minutes > 0 || hours > 0) {
    timeString += minutes + " menit, ";
  }
  timeString += seconds + " detik";

  return timeString;
};
