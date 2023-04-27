// Description: Logout function

export default function FormattedDate() {


  const currentDate = new Date();
  const formattedDateDay = currentDate.toLocaleString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric',
  });
  const formattedDateHour = currentDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return { formattedDateDay, formattedDateHour }
}