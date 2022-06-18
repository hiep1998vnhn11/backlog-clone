export enum PostScreenEnum {
  NEWFEED = 1,
  PROFILE = 2,
  DETAIL = 3,
}

export enum PostPermissionEnum {
  PUBLIC = 1,
  FRIEND = 2,
  ONLY = 3,
}

export enum PostTypeEnum {
  POST = 2,
  EXPERIENCE = 1,
  NEW_FEED = 0,
}

export enum CommentTypeEnum {
  POST = 'post',
  TOUR = 'tour',
  EXPERIENCE = 'experience',
  COMMENT = 'comment',
}

export const postType = {
  1: CommentTypeEnum.EXPERIENCE,
  2: CommentTypeEnum.POST,
  3: CommentTypeEnum.TOUR,
  4: CommentTypeEnum.COMMENT,
};

export const COMMENT_PER_PAGE = 10;
