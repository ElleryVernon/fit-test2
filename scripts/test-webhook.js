// 로컬 테스트용 스크립트
const webhooks = [
  { path: 'activities', data: { userId: 'test123', summaryId: 'act456', userAccessToken: 'token' }},
  { path: 'activity-details', data: { userId: 'test123', summaryId: 'act456', userAccessToken: 'token' }},
  { path: 'deregistrations', data: { userId: 'test123' }},
  { path: 'permissions', data: { userId: 'test123', permissions: ['ACTIVITY_READ'] }}
]

async function testWebhook(webhook) {
  const url = `http://localhost:3000/api/webhook/garmin/${webhook.path}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhook.data)
    })
    
    const result = await response.json()
    console.log(`✅ ${webhook.path}:`, response.status, result)
  } catch (error) {
    console.error(`❌ ${webhook.path}:`, error.message)
  }
}

// 모든 webhook 테스트
webhooks.forEach(testWebhook)