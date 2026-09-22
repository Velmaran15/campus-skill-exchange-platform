import { Avatar } from "../common";

interface UserAvatarProps {
  name: string;
  profileImage?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

export const UserAvatar = ({
  name,
  profileImage,
  size = "md",
  className = "",
}: UserAvatarProps) => {
  if (profileImage) {
    return (
      <img
        src={`http://localhost:5000/uploads/${profileImage}`}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-amber ${className}`}
      />
    );
  }

  return (
    <Avatar
      name={name}
      size={size}
    />
  );
};