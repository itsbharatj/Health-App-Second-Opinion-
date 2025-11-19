export interface HealthMetric {
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  blood_glucose: number;
  oxygen_saturation: number;
  body_temperature: number;
  steps: number;
  sleep_hours: number;
  timestamp: string;
}

export interface UserProfile {
  user_id: string;
  name: string;
  age: number;
  medical_conditions: string[];
  medications: string[];
  allergies: string[];
  emergency_contact: string;
  lifestyle_goal: string;
}

export interface Guardian {
  guardian_id: string;
  user_id: string;
  name: string;
  relationship: string;
  access_level: 'view_all' | 'view_alerts' | 'view_basic';
}

export interface MedicalDocument {
  document_id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  uploaded_at: string;
  analysis?: {
    status: string;
    summary?: string;
    extracted_conditions?: string[];
    key_findings?: string[];
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
