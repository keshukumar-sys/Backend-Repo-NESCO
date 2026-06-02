async function testPutWithFile() {
  try {
    const formData = new FormData();
    formData.append("description", "Test Description with file");
    
    // Create a dummy file blob
    const blob = new Blob(["test image content"], { type: "image/png" });
    formData.append("image", blob, "test_image.png");

    const response = await fetch('http://localhost:8040/api/v1/homepage/home-banner/69789b3f15108823f0d6b2b1', {
      method: 'PUT',
      body: formData
    });
    
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testPutWithFile();
