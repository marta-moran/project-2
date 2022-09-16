document.addEventListener(
    "DOMContentLoaded",
    () => {
        console.log("project-2-testing JS imported successfully!");
        console.log(window.lang)
        selection(window.lang);
        const lang = document.querySelector('#language')
        lang.addEventListener('change', setLang)
    },
    false
);

function setLang(lang) {
    language = lang.target.value
    axios.post(`${process.env.HEROKU_URL}setlanguage`, { language })
        .then((res) => {
            location.reload()
            console.log(res.data)
        })
        .catch((err) => next(err))

}

const selection = (language) => {
    const select = document.querySelector('select')
    select.value = language
}