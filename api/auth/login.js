export default function (req, res, next) {
  console.log("test", req, process.env.BASE_URL)
  res.end("hallo")
}
