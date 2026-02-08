import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  getProducts(

    @Query('type') type?: string,

    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {

    if (type) {
      return this.pokemonService.findByType(type, limit || 151);
    }
    

    return this.pokemonService.findAll(limit || 151);
  }
}