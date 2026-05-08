interface BuildFoundPetMatchTemplateParams {
  ownerName: string;
  lostAddress: string;
  foundAddress: string;
  foundPet: {
    species: string;
    breed?: string;
    color: string;
    size: string;
    description: string;
    photo_url?: string;
  };
  finder: {
    name: string;
    email: string;
    phone: string;
  };
  mapUrl: string;
  distance: number;
}

const DEFAULT_PET_IMAGE =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const buildFoundPetMatchTemplate = ({
  ownerName,
  lostAddress,
  foundAddress,
  foundPet,
  finder,
  mapUrl,
  distance,
}: BuildFoundPetMatchTemplateParams) => {
  const petImage = foundPet.photo_url || DEFAULT_PET_IMAGE;

  return `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: 0 auto;">
      <h2>🐾 Posible coincidencia encontrada para tu mascota</h2>

      <p>Hola <strong>${ownerName}</strong>,</p>

      <p>Se registró una mascota encontrada cerca del lugar donde reportaste la pérdida de tu mascota.</p>

      <h3>Foto de la mascota encontrada</h3>
      <p>
        <img
          src="${petImage}"
          alt="Mascota encontrada"
          style="width: 100%; max-width: 420px; border-radius: 12px; display: block;"
        />
      </p>

      <h3>Datos de la mascota encontrada</h3>
      <ul>
        <li><strong>Especie:</strong> ${foundPet.species}</li>
        <li><strong>Raza:</strong> ${foundPet.breed || 'No especificada'}</li>
        <li><strong>Color:</strong> ${foundPet.color}</li>
        <li><strong>Tamaño:</strong> ${foundPet.size}</li>
        <li><strong>Descripción:</strong> ${foundPet.description}</li>
      </ul>

      <h3>Datos de contacto de quien la encontró</h3>
      <ul>
        <li><strong>Nombre:</strong> ${finder.name}</li>
        <li><strong>Correo:</strong> ${finder.email}</li>
        <li><strong>Teléfono:</strong> ${finder.phone}</li>
      </ul>

      <h3>Ubicaciones</h3>
      <ul>
        <li><strong>Donde se perdió:</strong> ${lostAddress}</li>
        <li><strong>Donde se encontró:</strong> ${foundAddress}</li>
        <li><strong>Distancia aproximada:</strong> ${distance.toFixed(2)} metros</li>
      </ul>

      <h3>Mapa de referencia</h3>
      <p>
        <img
          src="${mapUrl}"
          alt="Mapa de referencia"
          style="width: 100%; max-width: 600px; border-radius: 12px; display: block;"
        />
      </p>

      <p style="margin-top: 24px;">PetRadar</p>
    </div>
  `;
};
