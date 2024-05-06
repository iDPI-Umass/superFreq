/*
Parse date to locale string
*/

export const formatDate = function ( date ) {
    const dateString = new Date(date).toLocaleDateString();
    return dateString;
}