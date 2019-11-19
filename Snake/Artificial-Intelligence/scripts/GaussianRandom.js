function gaussian(mean, stdev) {
  let y2;
  let use_last = false;
  return function() {
    let y1;
    if(use_last) {
      y1 = y2;
      use_last = false;
    } else {
      let x1, x2, w;
      do {
        x1 = 2.0 * Math.random() - 1.0;
        x2 = 2.0 * Math.random() - 1.0;
        w  = x1 * x1 + x2 * x2;
      } while(w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
    }
    return mean + stdev * y1;
  }
}

Array.prototype.stanDeviate = function() {
   var i,j,total = 0, mean = 0, diffSqredArr = [];
   for(i=0;i<this.length;i+=1){
       total+=this[i];
   }
   mean = total/this.length;
   for(j=0;j<this.length;j+=1){
       diffSqredArr.push(Math.pow((this[j]-mean),2));
   }
   return (Math.sqrt(diffSqredArr.reduce(function(firstEl, nextEl){
            return firstEl + nextEl;
          })/this.length));
};

const gaussianRandom = this.gaussian(0, 2);
const sample = [];

for (let i = 0; i < 10000; i++) {
  sample.push(gaussianRandom());
}

const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

console.log(`mean: ${arrAvg(sample)}`);
console.log(`stdev: ${sample.stanDeviate()}`);
