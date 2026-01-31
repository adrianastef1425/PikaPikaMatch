/**
 * Verification script to ensure mock data meets requirements
 */

import { mockApi } from './mockApi';

function verifyMockData() {
  const allCharacters = mockApi.getAllCharacters();
  
  console.log('=== Mock Data Verification ===\n');
  console.log(`Total characters: ${allCharacters.length}`);
  
  // Count by source
  const bySources = {
    pokemon: allCharacters.filter(c => c.source === 'pokemon').length,
    rickandmorty: allCharacters.filter(c => c.source === 'rickandmorty').length,
    superhero: allCharacters.filter(c => c.source === 'superhero').length,
  };
  
  console.log('\nCharacters by source:');
  console.log(`  Pokemon: ${bySources.pokemon}`);
  console.log(`  Rick and Morty: ${bySources.rickandmorty}`);
  console.log(`  Superhero: ${bySources.superhero}`);
  
  // Verify all characters have required fields
  console.log('\nVerifying required fields...');
  let allValid = true;
  
  allCharacters.forEach(char => {
    const hasAllFields = 
      char.id && 
      char.name && 
      char.imageUrl && 
      char.description && 
      char.source;
    
    if (!hasAllFields) {
      console.error(`❌ Character ${char.id || 'unknown'} is missing required fields`);
      allValid = false;
    }
  });
  
  if (allValid) {
    console.log('✓ All characters have required fields (id, name, imageUrl, description, source)');
  }
  
  // Verify unique IDs
  const ids = allCharacters.map(c => c.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('✓ All character IDs are unique');
  } else {
    console.error('❌ Duplicate character IDs found');
  }
  
  console.log('\n=== Verification Complete ===');
  
  return {
    totalCharacters: allCharacters.length,
    bySources,
    allValid,
    uniqueIds: ids.length === uniqueIds.size,
  };
}

export { verifyMockData };
