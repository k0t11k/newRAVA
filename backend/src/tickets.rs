use candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_stable_structures::{
    memory_manager::MemoryId,
    storable::{Bound, Storable},
    BTreeMap,
};
use serde::Serialize;
use std::borrow::Cow;
use std::cell::RefCell;

use super::{Memory, MEMORY_MANAGER};

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct Ticket {
    pub id: String,
    pub event_id: String,
    pub user_principal: Principal,
    pub qr_code: String,
    pub price: u64,
}

impl Storable for Ticket {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

thread_local! {
    static TICKETS: RefCell<BTreeMap<String, Ticket, Memory>> = RefCell::new(
        BTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
        )
    );
}

#[update]
pub fn buy_ticket(event_id: String, price: u64) -> Ticket {
    let principal = ic_cdk::caller();
    let ticket_id = format!("{}-{}", event_id, ic_cdk::api::time::now_ns());
    let ticket = Ticket {
        id: ticket_id.clone(),
        event_id,
        user_principal: principal,
        qr_code: format!("qr-{}", ticket_id),
        price,
    };
    TICKETS.with(|tickets| tickets.borrow_mut().insert(ticket_id.clone(), ticket.clone()));
    ticket
}

#[query]
pub fn get_user_tickets(user: Principal) -> Vec<Ticket> {
    TICKETS.with(|tickets| {
        tickets.borrow()
            .values()
            .filter(|t| t.user_principal == user)
            .cloned()
            .collect()
    })
}