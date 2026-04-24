export const mapCapmoStatusToSystemStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open': return 'Open';
    case 'in progress': return 'In Progress';
    case 'on hold': return 'On Hold';
    case 'done': return 'Done';
    case 'closed': return 'Closed';
    default: return 'Open';
  }
};