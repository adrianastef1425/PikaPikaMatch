/**
 * Manual verification script for mockApi
 * This can be run in the browser console or as a standalone test
 */

import { mockApi } from './mockApi';

async function testMockApi() {
  console.log('=== Testing Mock API ===\n');

  // Test 1: Get random character
  console.log('Test 1: Get random character');
  const char1 = await mockApi.getRandomCharacter();
  console.log('✓ Got character:', char1.name, '(', char1.source, ')');
  console.log('  Has required fields:', {
    id: !!char1.id,
    name: !!char1.name,
    imageUrl: !!char1.imageUrl,
    description: !!char1.description,
    source: !!char1.source,
  });

  // Test 2: Submit a vote
  console.log('\nTest 2: Submit vote');
  const voteResult = await mockApi.submitVote({
    characterId: char1.id,
    type: 'like',
    timestamp: Date.now(),
  });
  console.log('✓ Vote submitted:', voteResult.success);

  // Test 3: Get another random character (should be different)
  console.log('\nTest 3: Get another random character');
  const char2 = await mockApi.getRandomCharacter();
  console.log('✓ Got character:', char2.name, '(', char2.source, ')');
  console.log('  Different from first?', char1.id !== char2.id);

  // Test 4: Submit another vote
  console.log('\nTest 4: Submit another vote');
  await mockApi.submitVote({
    characterId: char2.id,
    type: 'dislike',
    timestamp: Date.now(),
  });
  console.log('✓ Vote submitted');

  // Test 5: Get favorites
  console.log('\nTest 5: Get favorites');
  const favorites = await mockApi.getFavorites(3);
  console.log('✓ Got favorites:', favorites.length, 'characters');
  favorites.forEach(stat => {
    const char = mockApi.getCharacterById(stat.characterId);
    console.log(`  - ${char?.name}: ${stat.likes} likes (${stat.likePercentage.toFixed(1)}%)`);
  });

  // Test 6: Get controversial
  console.log('\nTest 6: Get controversial');
  const controversial = await mockApi.getControversial(2);
  console.log('✓ Got controversial:', controversial.length, 'characters');
  controversial.forEach(stat => {
    const char = mockApi.getCharacterById(stat.characterId);
    console.log(`  - ${char?.name}: ${stat.dislikes} dislikes (${stat.dislikePercentage.toFixed(1)}%)`);
  });

  // Test 7: Get recent votes
  console.log('\nTest 7: Get recent votes');
  const recent = await mockApi.getRecentVotes(4);
  console.log('✓ Got recent votes:', recent.length, 'characters');
  recent.forEach(evalChar => {
    console.log(`  - ${evalChar.name}: ${evalChar.vote}`);
  });

  // Test 8: Verify latency simulation
  console.log('\nTest 8: Verify latency simulation (200-500ms)');
  const start = Date.now();
  await mockApi.getRandomCharacter();
  const duration = Date.now() - start;
  console.log('✓ Request took:', duration, 'ms');
  console.log('  Within range?', duration >= 200 && duration <= 600); // Allow some margin

  console.log('\n=== All tests completed ===');
}

// Export for use in other contexts
export { testMockApi };
