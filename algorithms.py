#=================================================================================================
#                                      SEARCHING ALGORITHMS
#=================================================================================================
def binary_search(items, target):
    mid = len(items) // 2
    if len(items) == 1:
        return mid if items[mid] == target else False
    elif items[mid] == target:
        return mid
    else:
        if items[mid] < target:
            callback_response = binary_search(items[mid:], target)
            return mid + callback_response if callback_response is not False else False
        else:
            return binary_search(items[:mid], target)

def linear_search(items,target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return None
        
#=================================================================================================
#                                      SORTING ALGORITHMS
#=================================================================================================
def bubble_sort(items):
    for i in range(len(items)):
        for j in range(len(items)-1-i):
            if items[j] > items[j+1]:
                items[j], items[j+1] = items[j+1], items[j]  
    return items

def insertion_sort(lst):
    i = 1
    while i < len(lst):
        x=lst[i]
        j=i-1
        while j>=0 and lst[j]>x:
            lst[j+1]=lst[j]
            j=j-1
        lst[j+1]=x
        i=i+1
    return lst

def merge(A, B):  
    """ The merge function used in merge sort """
    new_list = []
    while len(A) > 0 and len(B) > 0:
        if A[0] < B[0]:
            new_list.append(A[0])
            A.pop(0)
        else:
            new_list.append(B[0])
            B.pop(0)
    
    if len(A) == 0:
        new_list = new_list + B    
    if len(B) == 0:
        new_list = new_list + A
        
    return new_list        
            
def merge_sort(items):
    """ Implementation of merge sort """

    len_i = len(items)
    if len_i == 1:
        return items       
        
    mid_point = int(len_i / 2)
    i1 = merge_sort(items[:mid_point])
    i2 = merge_sort(items[mid_point:])       
    
    return merge(i1, i2)

def quick_sort(items, index=-1):
    """ Implementation of quick sort """
    len_i = len(items)

    if len_i <= 1:
        return items

    pivot = items[index]
    small = []
    large = []
    dup = []
    for i in items:
        if i < pivot:
            small.append(i)
        elif i > pivot:
            large.append(i)
        elif i == pivot:
            dup.append(i)

    small = quick_sort(small)
    large = quick_sort(large)

    return small + dup + large