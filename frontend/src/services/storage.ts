interface HealthJournalEntry {
  id: number;
  date: string;
  mood: 'good' | 'okay' | 'poor';
  activities: string;
  notes: string;
  sleep: number;
  energy: number;
}

interface MealEntry {
  id: number;
  name: string;
  calories: number;
  time: string;
  protein: number;
  carbs: number;
  fats: number;
}

interface Companion {
  id: number;
  name: string;
  relation: string;
  avatar: string;
  enabled: boolean;
}

interface Document {
  id: number;
  name: string;
  date: string;
  type: string;
  summary: string;
  content?: string;
}

export const storage = {
  getJournalEntries(): HealthJournalEntry[] {
    const data = localStorage.getItem('healthJournal');
    return data ? JSON.parse(data) : [];
  },

  saveJournalEntries(entries: HealthJournalEntry[]): void {
    localStorage.setItem('healthJournal', JSON.stringify(entries));
  },

  getMeals(): MealEntry[] {
    const data = localStorage.getItem('meals');
    return data ? JSON.parse(data) : [
      { id: 1, name: 'Breakfast - Oatmeal', calories: 350, time: '8:00 AM', protein: 12, carbs: 54, fats: 8 },
      { id: 2, name: 'Lunch - Chicken Salad', calories: 450, time: '12:30 PM', protein: 35, carbs: 25, fats: 22 },
      { id: 3, name: 'Snack - Apple', calories: 95, time: '3:00 PM', protein: 0, carbs: 25, fats: 0 },
    ];
  },

  saveMeals(meals: MealEntry[]): void {
    localStorage.setItem('meals', JSON.stringify(meals));
  },

  getCompanions(): Companion[] {
    const data = localStorage.getItem('companions');
    return data ? JSON.parse(data) : [
      { id: 1, name: 'John Doe', relation: 'Brother', avatar: 'https://i.pravatar.cc/150?img=11', enabled: true },
      { id: 2, name: 'Jane Doe', relation: 'Sister', avatar: 'https://i.pravatar.cc/150?img=5', enabled: false },
      { id: 3, name: 'Dr. Smith', relation: 'Trainer', avatar: 'https://i.pravatar.cc/150?img=8', enabled: true },
      { id: 4, name: 'Dr. Jones', relation: 'Doctor', avatar: 'https://i.pravatar.cc/150?img=9', enabled: true },
    ];
  },

  saveCompanions(companions: Companion[]): void {
    localStorage.setItem('companions', JSON.stringify(companions));
  },

  getDocuments(): Document[] {
    const data = localStorage.getItem('documents');
    return data ? JSON.parse(data) : [
      { id: 1, name: 'Blood Test Results', date: '12/11/2025', type: 'pdf', summary: '' },
      { id: 2, name: 'MRI Scan Report', date: '10/11/2025', type: 'pdf', summary: '' },
      { id: 3, name: 'Heart Rate Log', date: '05/11/2025', type: 'csv', summary: '' },
    ];
  },

  saveDocuments(documents: Document[]): void {
    localStorage.setItem('documents', JSON.stringify(documents));
  },

  getHealthData() {
    const data = localStorage.getItem('healthData');
    return data ? JSON.parse(data) : {
      heartRate: 78,
      bloodPressure: '120/80',
      steps: 8450,
      sleep: 7.5,
      activities: 'Walking, light exercise',
      calories: 1850,
      water: 6,
      weight: 165,
      bloodSugar: 105,
      oxygen: 98,
      temperature: 98.6
    };
  },

  saveHealthData(healthData: any): void {
    localStorage.setItem('healthData', JSON.stringify(healthData));
  },

  getUserProfile() {
    const data = localStorage.getItem('userProfile');
    return data ? JSON.parse(data) : {
      name: 'Gaurav',
      age: 68,
      conditions: ['Mild hypertension', 'Arthritis'],
      medications: ['Lisinopril 10mg daily', 'Ibuprofen as needed'],
      allergies: ['Penicillin'],
      emergencyContacts: ['John Doe (Brother)', 'Dr. Smith (Doctor)'],
      recentActivities: ['Morning walk 30 min', 'Yoga session', 'Reading']
    };
  },

  saveUserProfile(profile: any): void {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }
};
