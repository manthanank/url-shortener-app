export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  adminNotes?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactListResponse {
  success: boolean;
  data: {
    contacts: Contact[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
}

export interface ContactStatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: {
      new: number;
      read: number;
      replied: number;
    };
  };
}
