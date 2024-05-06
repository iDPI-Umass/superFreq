/*
If user has chose a display_name, use that instead of username
*/

export const profileName = function (username, display_name) {
    let profileName = "";
    if ( username != display_name && display_name == true ) {
        profileName = display_name;
    }
    else {
        profileName = username;
    }
    return profileName;
}