---
title: JAVA堆排序
tags: 数据结构
categories: IT
date: 2019-06-11 14:03:08
---

## 堆排序(最大堆为例)

堆排序是利用堆的特性来实现排序，经典的实现方式是采用最大堆（一种完全二叉树），“冒泡”顶端元素实现排序

## 堆排序实现步骤

### 1.将需要排序的数组构建成一个最大堆

由于完全二叉树的位置存在规律，所以完全二叉树可以由一个数组来表示，其左孩子就是2i+1位置，右孩子是2i-1，父节点位置i/2，i为数组索引。最大堆的构建就是利用这一点来实现的。下面我们展示一种将一个无序的数组转换为一个最大堆的实例

**[!]**: 将一个无序的数组转换为最大堆有很多种方法，我这里讲的是其中一种方式也是网上和书上也流行的一种方式，也就是用`下滤`这种操作来一步步的将无序数组转换为最大堆的排序方式。其他方法还有使用`上滤`，具体可以在网上参考二叉堆（优先队列）的实现，本文不会提及太多。

我们拿下面的一个打乱的数组举例
int arr[] = new int[]{150,80,40,30,10,70,110,100,20,90,60,50,120,140,130}

因为（二叉）最大堆的特性，所以我们可以将其内容用完全二叉树来表示，如下图所示,可以看到数据110的节点是我们最小的可视为一棵树的单位，它在数组的位置正好是length/2 -1也就是arr[6]。

<img src="/images/tmpImage/heapSort_1.png" />
转换为完全二叉树表示后，就可以通过图解的方式轻松的探讨最大堆是怎么一步步构建出来的。下面我先贴代码，然后在代码的注释中讲解如何构建。
```java
    //二叉堆的特性：一个根节点的左孩子在数组中的索引就是2*rootIndex +1，你可以通过观察我前面的图自己来验证这个原理
    private int leftChild(int rootIndex){
        return 2 * rootIndex + 1;
    }

    //二叉堆特性：右孩子=左孩子+1，你可以通过观察我前面的图来验证这个原理
    private int rightChild(int leftChild){
        return ++leftChild;
    }

    //判断是否存在右孩子
    //二叉堆特性： 验证最后一个左孩子是否是数组最后一个元素，如果不是那说明是有右孩子的
    private boolean haveRightChild(int leftChild,int arrLength){
        return leftChild != (arrLength - 1);
    }

    //下滤，维持最大堆性质的规则方法，请好好阅读并配合图解来理解即可
    private void percDown(int[] arr,int rootIndex,int length){
        int child;
        int temp;
        
        for (temp = arr[rootIndex]; leftChild(rootIndex) < length; rootIndex = child) {
            child = leftChild(rootIndex);

            if(child != length -1){
                if(arr[child] < arr[child+1]){
                    ++child;
                }
            }
            //和根节点交换位置完成下滤
            if(arr[rootIndex] < arr[child]){
                arr[rootIndex] = arr[child];
                arr[child] = temp;
            }
            //当前根节点树已满足条件无需下滤调整
            else{
                break;
            }

        }
    }

    //建立最大堆
    private void buildMaxHeap(int[] arr){
        //从arr.length/2-1开始，这是最小的根节点，相当于图中110元素数据的位置。
        for (int i = arr.length/2 - 1; i >=0 ; i--) {
            percDown(arr,i,arr.length);
        }
    }

```

**[!]**: 这种构建方式构建时必须从length/2-1开始，也就是最小的根节点开始。不然会导致下滤不完全，最终得到的不会符合最大堆性质，你可以从图片中模拟这个情况的发生，比如从最顶端开始下滤，随后你会发现就有一部分元素（比如120,130,140这些元素）会被这个构建算法忽视，从而无法实现最大堆


### “冒泡”最大堆

利用最大堆的数据结构，每次获取最小元素，转移至一个新数组（空间浪费），或者直接将最小元素转移至数组第一个位置。以此递归最终得到有序数组。

代码如下实现：
```java
     //将最大堆的顶端元素移动至数组最后一位，堆最大长度缩小1，循环此操作，变可以得到一个排好序的数组，这就是堆排序
    private void sortByMaxheap(int[] arr){
        for (int i = arr.length-1; i > 0; i--) {
            swap(arr,0,i);//array[0]也就是最大的数，移动到i处，也就是相对的末尾处
            percDown(arr,0,i);//转换后arr[0]的位置变成了最小元素，其他位置都正常，所以需要对其做一次下滤操作使得最大堆性质不被破坏
        }
    }

    private void swap(int[] arr, int i, int j){
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    //调用堆排序
    public void heapSort(int[] arr){
        buildMaxHeap(arr);
        sortByMaxheap(arr);
    }
```

## 时间复杂度分析：
1. 建堆的时间复杂度：O（N）
2. 选取最大值并排序的时间复杂度是：O（logN）
所以总体的时间复杂度为O（NlogN）

## 算法稳定性分析：
不稳定，存在前后置换，所以会有后面的数据被换到前面的可能性