class BloomFilter {
    constructor(size = 10) {
      this.size = size;
      this.bits = new Array(size).fill(0);
    }
  
    // Simple hash functions
    hash1(str) {
      let sum = 0;
      for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
      }
      return sum % this.size;
    }
  
    hash2(str) {
      let sum = 0;
      for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i) * (i + 1);
      }
      return sum % this.size;
    }
  
    // Add element
    add(str) {
      const i1 = this.hash1(str);
      const i2 = this.hash2(str);
  
      this.bits[i1] = 1;
      this.bits[i2] = 1;
  
      console.log(`Added "${str}" → [${i1}, ${i2}]`);
    }
  
    // Check element
    contains(str) {
      const i1 = this.hash1(str);
      const i2 = this.hash2(str);
  
      const result = this.bits[i1] === 1 && this.bits[i2] === 1;
  
      console.log(
        `Check "${str}" → [${i1}, ${i2}] → ${
          result ? "Maybe present ⚠️" : "Definitely NOT present ❌"
        }`
      );
  
      return result;
    }
  
    print() {
      console.log("Bits:", this.bits.join(" "));
    }
  }
  
  // Demo
  const bf = new BloomFilter(10);
  
  bf.add("cat");
  bf.add("dog");
  
  bf.print();
  
  bf.contains("cat"); // Maybe present
  bf.contains("bat"); // Could be false positive