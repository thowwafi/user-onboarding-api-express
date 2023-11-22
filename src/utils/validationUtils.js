// Check if a string is valid (not empty or null)
function isValidString(value) {
    return typeof value === 'string' && value.trim() !== '';
}

// Validate file format and size
function isValidFile(file, allowedFormats = ['jpeg', 'jpg', 'png'], maxSizeInBytes = 5 * 1024 * 1024) {
    if (!file || !file.mimetype) {
        return false;
    }

    const fileFormat = file.mimetype.split('/')[1];
    const isValidFormat = allowedFormats.includes(fileFormat.toLowerCase());
    const isValidSize = file.size <= maxSizeInBytes;

    return isValidFormat && isValidSize;
}

module.exports = {
    isValidString,
    isValidFile,
};
