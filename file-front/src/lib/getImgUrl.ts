export default function getImg(url: string) {
  if (url !== undefined) {
    let u = url.substring(7)
    return 'https://images.weserv.nl/?url=' + u
  }
}
