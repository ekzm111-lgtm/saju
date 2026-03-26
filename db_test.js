const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://kmrigsfjsdsfzpugtfnq.supabase.co";
const SUPABASE_KEY = "sb_publishable_5how-klMccwuZ5zqic_7Xw_LLkSAy6K"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function insertActualDummy() {
    console.log("=== payments 테이블 더미 데이터 5건 삽입 시작 ===");
    
    for (let i = 1; i <= 5; i++) {
        const orderId = `order_test_${Date.now()}_${i}`;
        const payload = {
            order_id: orderId,
            service_name_snapshot: "종합 사주 도우미 (테스트)",
            buyer_name: `더미사용자${i}`,
            buyer_email: `dummy${i}@example.com`,
            buyer_phone: `010-0000-000${i}`,
            amount: 0,
            payment_method: "free",
            status: "paid",
            portone_payment_id: `test_pay_${i}`,
            result_link: `/result?orderId=${orderId}`,
            result_json: { message: `테스트 데이터 ${i}번 결과입니다.` },
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('payments').insert([payload]);
        if (error) {
            console.log(`- [${i}/5] 실패: ${error.message}`);
        } else {
            console.log(`- [${i}/5] 성공! (order_id: ${orderId})`);
        }
    }
    console.log("=== 모든 작업 완료 ===");
}

insertActualDummy();
