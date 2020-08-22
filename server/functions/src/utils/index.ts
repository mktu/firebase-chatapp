
import { Room } from '../../../../types/room';
export const checkContactMatch = (val:Room, ids:string[])=>{
    if (!val.contact) {
      return false;
    }
    const sortedIds = ids.sort();
    const roomContacts = val.contact.sort();
    if(sortedIds.length!==roomContacts.length){
        return false;
    }
    return sortedIds.every((id,idx)=>{
        return id === roomContacts[idx]
    })
  }
  