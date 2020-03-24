
function formatFieldName(fieldName) {
    return fieldName.replace(/[ \/\:]/g, '_')
}

export {
    formatFieldName
}
