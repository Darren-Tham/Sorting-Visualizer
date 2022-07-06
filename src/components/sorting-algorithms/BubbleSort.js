export default function BubbleSort() {
  const arr = Array.from(document.getElementsByClassName('bar'))
  console.log(arr)
  const n = arr.length
  
	for (let i = n - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      const currHeight = parseFloat(arr[j].style.height)
      const nextHeight = parseFloat(arr[j + 1].style.height)
      if (currHeight > nextHeight) {
        const currLeft = arr[j].style.left
        const nextLeft = arr[j + 1].style.left

        arr[j].style.left = nextLeft
        arr[j + 1].style.left = currLeft

        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
			}
    }
  }
}