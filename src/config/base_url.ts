const UAT = true

const BASE_URL = UAT
    ? `http://192.168.1.60/puad/index.php`
    : `https://google.com`

export {
    UAT,
    BASE_URL
}
