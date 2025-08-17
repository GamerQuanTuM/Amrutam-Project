const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${time}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${time}`;
  } else {
    return `${date.toLocaleDateString("en-US", { weekday: "long" })}, ${time}`;
  }
};

export default formatDate;