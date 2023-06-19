using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.DB;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonaController : ControllerBase
    {


        [HttpPost]
        public async Task<ActionResult> PostAsync(DB.NewPersona newPersona)
        {
            using var db = new PadronContext();
            var edad = DateTime.Now.Year - newPersona.FechaNacimiento.Year;
            var persona = new DB.Persona
            {
                Apellidos = newPersona.Apellidos,
                Nombres = newPersona.Nombres,
                Sexo = newPersona.Sexo,
                Cedula = newPersona.Cedula,
                FechaNacimiento = newPersona.FechaNacimiento,
                Direccion = newPersona.Direccion,
                LugarNacimiento = newPersona.LugarNacimiento,
                Telefono = newPersona.Telefono,
                Edad = edad
            };
            db.Personas.Add(persona);
            await db.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DB.Persona>>> GetAsync()
        {
            using var db = new PadronContext();
            return await db.Personas.ToListAsync();
        }
    }
}
