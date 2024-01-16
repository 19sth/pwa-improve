import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { ITargetItem } from "../redux/sliceTarget";

export default function Detail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [thisTarget, setThisTarget] = useState({} as ITargetItem);

  const targets = useSelector((rootState: RootState) => rootState.target.targets);

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "Add",
      })
    );
  }, [dispatch]);

  useEffect(()=>{
    if (targets && targets.length > 0 && id) {
      const localTarget = targets.filter(e=>e.id === Number.parseInt(id))
      if (localTarget.length > 0) {
        setThisTarget(localTarget[0] as ITargetItem)
      } else {
        navigate(-1);
      }
    } 
  }, [id, navigate, targets])


  return (
    <div>
      {thisTarget.name}
    </div>
  );
}
