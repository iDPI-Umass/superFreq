let profileStorage: string 
let profileObject: App.Lookup 
let displayName: string 
let avatarUrl: string 
let username: string 

if (typeof window !== 'undefined') {   
     profileStorage = localStorage.getItem("profile") as string
     profileObject = JSON.parse(profileStorage)
     displayName = profileObject?.displayName as string
     avatarUrl = profileObject?.avatarUrl as string
     username = profileObject?.username as string
}

export {
    profileStorage,
    profileObject,
    displayName,
    avatarUrl,
    username
}