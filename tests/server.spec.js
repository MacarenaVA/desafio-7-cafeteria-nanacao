const request = require("supertest")
const server = require("../index")

describe("Operaciones CRUD de cafes", () => {
  it("obtener status code", async () => {
    const response = await request(server).get("/cafes").send()
    const status = response.statusCode
    expect(status).toBe(200)
  })
  it("get/cafes retorna un array con al menos un objeto", async () => {
    const { body } = await request(server).get("/cafes").send()
    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBeGreaterThan(0)
  })

  it("intentar eliminar un cafe con un id que no existe", async () => {
    const jwt = "token"
    const idDeCafeAEliminar = 5
    const response = await request(server)
      .delete(`/cafes/${idDeCafeAEliminar}`)
      .set("Authorization", jwt)
      .send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toContain(idDeCafeAEliminar)
  })

  it("agregar un nuevo cafe", async () => {
    const idDeCafe = Math.floor(Math.random() * 999)
    const cafeNuevo = {
      idDeCafe,
      nombre: "nombre",
    }
    const response = await request(server).post("/cafes").send(cafeNuevo)
    expect(response.status).toBe(201)
    expect(response.body).toContainEqual(cafeNuevo)
  })

  it("devolver un código 400 si el ID en los parámetros es diferente al ID en el payload", async () => {
    const cafeExistente = {
      id: 1,
      nombre: "Cortado",
    }

    const idEnParametrosDiferente = 999

    const response = await request(server)
      .put(`/cafes/${idEnParametrosDiferente}`)
      .send(cafeExistente)
      .set("Content-Type", "application/json")

    expect(response.status).toBe(400)
  })
})
