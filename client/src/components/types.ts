export interface Course {
  courseName: string;
  courseOrganiser: string;
  courseDuration: string;
  courseUrl: string;
  courseMaterials: any[];
  videos: Video[];
  courseThumbnail?: string;
  progress: string;
  noOfLectures: number;
}

export interface Video {
  videoUrl: string;
  videoTitle: string;
  videoDuration: string;
  videoThumbnailUrl: string;
  watched?: boolean;
  index?: number;
}

export interface Goal {
  id: number;
  task: string;
  done: boolean;
}

export interface Remainder {
  id: number;
  task: string;
  done: boolean;
}

export interface User {
  profileImg: string;
  username: string;
  email: string;
  actualName: string | null;
  schoolName: string | null;
  address: string | null;
  currentClass: string | null;
  courses: Course[];
  lastFiveLogin: string[];
}
