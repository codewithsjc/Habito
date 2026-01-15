// Download backup file
export const downloadBackup = (data, filename = 'habits-backup.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// Read backup file
export const readBackupFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Validate backup data structure
export const validateBackupData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' };
  }
  
  if (!data.habits || !Array.isArray(data.habits)) {
    return { valid: false, error: 'Missing or invalid habits array' };
  }
  
  // Validate habit structure
  for (const habit of data.habits) {
    if (!habit.id || !habit.name || !habit.type) {
      return { valid: false, error: 'Invalid habit structure' };
    }
  }
  
  if (data.completions && !Array.isArray(data.completions)) {
    return { valid: false, error: 'Invalid completions array' };
  }
  
  return { valid: true };
};
