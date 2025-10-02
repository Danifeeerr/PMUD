function concat_sort(...arrays)
{
    return [].concat(...arrays).sort((a,b) => a-b);
}

console.log(concat_sort([7], [3,2], [5,16,4], [1]));