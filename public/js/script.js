document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project-2-testing JS imported successfully!");
    getbtns()
    document.getElementById('check').addEventListener('click', getPhrase)
  },
  false
);

function getbtns() {
  // const div = document.querySelector('#phrase')
  const otrodiv = document.querySelector('.result')
  const btns = document.querySelectorAll('.word')
  console.log(btns)
  for (let btn of btns) {
    btn.addEventListener('click', () => {
      const paragraph = document.createElement('span')
      paragraph.setAttribute('class', 'btn-translate') //
      paragraph.textContent = btn.textContent
      otrodiv.appendChild(paragraph)
      btn.remove()
      getLastParagraphs()
    })
  }
}

function getLastBtns() {
  // const div = document.querySelector('#phrase')
  const otrodiv = document.querySelector('.result')
  const btns = document.querySelectorAll('.word')
  console.log(btns)
  btns[btns.length - 1].addEventListener('click', () => {
    const paragraph = document.createElement('span')
    paragraph.setAttribute('class', 'btn-translate')
    paragraph.textContent = btns[btns.length - 1].textContent
    otrodiv.appendChild(paragraph)
    btns[btns.length - 1].remove()
    getLastParagraphs()
  })

}

function getLastParagraphs() {
  const divBtn = document.querySelector('#btn-div')
  const ps = document.querySelectorAll('span')
  console.log(ps)

  ps[ps.length - 1].addEventListener('click', () => {
    const btn = document.createElement('button')
    btn.setAttribute('class', 'word btn-frase')
    btn.textContent = ps[ps.length - 1].textContent
    divBtn.appendChild(btn)
    ps[ps.length - 1].remove()
    console.log("GET BTNS")
    getLastBtns()
  })
}


async function getPhrase() {
  try {
    let ps = document.querySelectorAll('#phrase span')
    const phrase = []
    for (let p of ps) {
      phrase.push(p.textContent)
    }

    const res = await axios.get('http://localhost:3000/series/getphrase')

    console.log(res.data.phrase)
    const enPhrase = res.data.phrase
    const esPhrase = res.data.words
    const id = res.data.id
    const userId = res.data.userId

    console.log(checkPhrase(phrase, esPhrase))

    if (checkPhrase(phrase, esPhrase)) {
      const points = phrase.length
      const res = await axios.post(`http://localhost:3000/users/${userId}/points`, { points })
      console.log("res--->", res)
      window.location.href = `http://localhost:3000/series/${id}/translate`
    }


  } catch (err) {
    console.log(err)
  }
}

function checkPhrase(phrase, ogPhrase) {

  const phrase1 = phrase.join(" ");
  const phrase2 = ogPhrase.join(" ");
  console.log(phrase1, phrase2);
  if (phrase1 === phrase2) {
    return true
  } else {
    return false;
  }

}
