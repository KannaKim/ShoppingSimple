import '@testing-library/jest-dom'
 
describe('DB', () => {
  it('fetch users', () => {
    fetch("localhost:3000/api/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      expect(response.status).toBe(200)
      return response.json()
    })

  })
})