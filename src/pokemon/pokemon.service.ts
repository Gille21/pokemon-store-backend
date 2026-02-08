import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';


  async findAll(limit: number = 50, type?: string, order?: 'asc' | 'desc') {
    const response = await axios.get(`${this.baseUrl}/pokemon?limit=${limit}`);
    const results = response.data.results;

    let pokemons = await Promise.all(
      results.map(async (p: any) => {
        const detail = await axios.get(p.url);
        return {
          id: detail.data.id,
          name: detail.data.name,

          image: detail.data.sprites.versions['generation-iv']['diamond-pearl'].front_default,
          types: detail.data.types.map((t: any) => t.type.name),
          price: detail.data.base_experience * 10,
          stats: detail.data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
          weight: detail.data.weight,
          height: detail.data.height,
          description: `Un Pokémon de tipo ${detail.data.types[0].type.name} listo para tu equipo.`
        };
      }),
    );


    if (type) {
      pokemons = pokemons.filter(p => p.types.includes(type.toLowerCase()));
    }


    if (order) {
      pokemons.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    }

    return pokemons;
  }


  async findByType(type: string, limit: number = 151) {

    return this.findAll(limit, type);
  }
}