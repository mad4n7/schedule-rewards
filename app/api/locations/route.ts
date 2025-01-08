import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const stateId = url.searchParams.get('state');
    const locale = url.searchParams.get('locale') || 'en';
    const countryCode = locale === 'pt-BR' ? 'BR' : 'US';

    console.log('Location API Request:', { countryCode, stateId, locale });

    if (stateId) {
      // Fetch cities for a specific state
      console.log('Fetching cities for state:', stateId);
      const cities = await prisma.city.findMany({
        where: { state_id: stateId },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      });
      
      console.log('Found cities:', cities.length);
      return NextResponse.json(cities.map(city => ({
        id: city.id,
        name: city.name,
      })));
    } else {
      // Fetch states for a country
      console.log('Fetching states for country:', countryCode);
      try {
        const states = await prisma.state.findMany({
          where: { country_code: countryCode.toUpperCase() },
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
          orderBy: { name: 'asc' },
        });

        console.log('Found states:', states);
        return NextResponse.json(states.map(state => ({
          id: state.id,
          name: state.name,
          abbreviation: state.abbreviation,
        })));
      } catch (stateError) {
        console.error('Error fetching states:', stateError);
        throw stateError;
      }
    }
  } catch (error) {
    console.error('Error in location API:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return new NextResponse(error instanceof Error ? error.message : 'Internal Error', { status: 500 });
  }
}
