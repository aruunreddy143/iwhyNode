


class BubbleSort {
    constructor(values) {
        this.arrayValues = values;
    }
    swapArray(values, i, j) {
        let temp = values[i];
        values[i] = values[j];
        values[j] = temp;
        return temp;
    }
    sort() {
        for (let i = 0; i < this.arrayValues.length; i++) {
            for (let j = 1; j < this.arrayValues.length; j++) {
                if (this.arrayValues[j - 1] > this.arrayValues[j]) {
                    this.swapArray(this.arrayValues, j - 1, j)
                }
            }
        }
        return this.arrayValues;
    }
}

let bubbleSort = new BubbleSort([4, 5, 7, 2, 7, 2, 6, 1]);

bubbleSort.sort();


class BubbleSortAdvance extends BubbleSort {
    constructor(values) {
        super(values);
    }
    sort() {
        let swappedArray;
        do {
            swappedArray = false;
            for (let i = 0; i < this.arrayValues.length; i++) {
                if (this.arrayValues[i] && this.arrayValues[i + 1] && this.arrayValues[i] > this.arrayValues[i + 1]) {
                    this.swapArray(this.arrayValues, i, i + 1);
                    swappedArray = true;
                }
            }
        } while (swappedArray);
        return this.arrayValues;
    }
}

let bubbleSortAdvance = new BubbleSortAdvance([5, 3, 6, 2, 5, 8, 1]);
bubbleSortAdvance.sort();