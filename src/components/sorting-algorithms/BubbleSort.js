export default function BubbleSort(nums) {
  const bars = Array.from(document.getElementsByClassName('bar'))
  const n = bars.length
  
	for (let i = n - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (nums[j] > nums[j + 1]) {
        let temp = bars[j].style.left
        bars[j].style.left = bars[j + 1].style.left
        bars[j + 1].style.left = temp
        
        temp = bars[j]
        bars[j] = bars[j + 1]
        bars[j + 1] = temp

        temp = nums[j]
        nums[j] = nums[j + 1]
        nums[j + 1] = temp
			}
    }
  }
  return nums
}