let profileStorage;
let profileObject;
let username;
if (typeof window !== "undefined") {
  profileStorage = localStorage.getItem("profile");
  profileObject = JSON.parse(profileStorage);
  profileObject?.displayName;
  profileObject?.avatarUrl;
  username = profileObject?.username;
}
export {
  username as u
};
