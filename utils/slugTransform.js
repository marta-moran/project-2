function slugTransform(title) {

    const titleTrans = title.toLowerCase().replace(/\s/g, '-');
    return titleTrans;

}

module.exports = slugTransform;