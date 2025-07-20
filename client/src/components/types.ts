export interface Goal {
  id: number;
  task: string;
  done: boolean;
}

export type Remainder = Goal & {
  notifyAt?: Date | string;
};

export interface Video {
  videoUrl: string;
  videoTitle: string;
  videoDuration: string;
  videoThumbnailUrl: string;
  watched?: boolean;
  index?: number;
}

export interface CourseMaterial {
  file: File | null;
  type: string | null;
}

export interface Course {
  courseName: string;
  courseUrl: string;
  progress?: string;
  videos: Video[];
  noOfLectures?: number;
  courseOrganiser: string;
  courseDuration: string;
  courseMaterials: CourseMaterial[];
  courseThumbnail?: string;
}

export interface User {
  username: string;
  email: string;
  profileImg: string;
  deviceInfo?: string | null;
  actualName: string | null;
  schoolName: string | null;
  address: string | null;
  currentClass: string | null;
  courses: Course[];
  lastFiveLogin: string[];
  continuingCourse?: string | null;
}

export type ErrorType = {
  message?: string;
};
