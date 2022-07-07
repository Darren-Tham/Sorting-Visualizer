export default function BubbleSort(arr) {  
  const n = arr.length

  for (let i = n - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j].props.num > arr[j + 1].props.num) {        
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }

  return arr  
}